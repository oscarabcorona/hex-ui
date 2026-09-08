#!/usr/bin/env bash
#
# End-to-end smoke test for the React Native install path (Theme K).
#
# Scaffolds a throwaway Expo app, runs the real `hex` binary against it, and
# bundles the result with Metro. No simulator and no device: `expo export`
# compiles and links everything, which is what catches the failures that
# matter here — a component importing something the consumer never installed,
# an import the CLI failed to rewrite, a NativeWind config that does not load.
#
# Runs on Linux and macOS alike, so it can gate CI.
#
#   ./scripts/smoke-native.sh [workdir]
#
# Exits non-zero on the first failure. Leaves the workdir in place when
# HEX_SMOKE_KEEP=1, for inspecting a failure.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HEX_CLI="$REPO_ROOT/packages/cli/dist/index.js"

# Only ever delete a directory this script created. The cleanup trap runs
# `rm -rf "$WORKDIR"`, and WORKDIR used to default to a caller-supplied path —
# so `./scripts/smoke-native.sh ~/dev/scratch` with the CLI unbuilt would fail
# on the very next line and take the caller's directory with it.
if [ -n "${1:-}" ]; then
	if [ -e "$1" ]; then
		printf '\033[31mFAIL: %s already exists. Pass a path that does not exist, or omit the argument.\033[0m\n' "$1" >&2
		exit 1
	fi
	mkdir -p "$1"
	WORKDIR="$(cd "$1" && pwd)"
	WORKDIR_IS_OURS=1
else
	# An explicit template, not `-t hex-native-smoke`: GNU coreutils rejects a
	# template with no X's ("too few X's"), so the BSD-only form meant this
	# script could never run on the Linux runner it claims to gate.
	WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/hex-native-smoke.XXXXXX")"
	WORKDIR_IS_OURS=1
fi
APP_DIR="$WORKDIR/app"

# Components to install. `card` exercises the transitive path: it pulls in
# `text` plus the shared `lib/text-context` module.
COMPONENTS=(button card input switch)

step() { printf '\n\033[1m==> %s\033[0m\n' "$1"; }
fail() { printf '\033[31mFAIL: %s\033[0m\n' "$1" >&2; exit 1; }

cleanup() {
	# Never delete something we did not create, even if the trap fires early.
	if [ "${WORKDIR_IS_OURS:-0}" != "1" ]; then
		return
	fi
	if [ "${HEX_SMOKE_KEEP:-0}" = "1" ]; then
		printf '\nWorkdir kept at %s\n' "$WORKDIR"
	else
		rm -rf "$WORKDIR"
	fi
}
trap cleanup EXIT

[ -f "$HEX_CLI" ] || fail "CLI not built. Run: pnpm --filter @hex-core/cli build"

step "Scaffolding an Expo app in $APP_DIR"
mkdir -p "$WORKDIR"
# Installs as it scaffolds. `--no-install` would be faster, but then `expo`
# itself is absent and the `expo install` below cannot read the SDK version
# it needs to resolve compatible packages.
npx --yes create-expo-app@latest "$APP_DIR" --template blank-typescript >/dev/null 2>&1 \
	|| fail "create-expo-app failed"

cd "$APP_DIR"

step "hex init (expects native autodetection)"
INIT_OUT="$(node "$HEX_CLI" init --no-install 2>&1)" || { echo "$INIT_OUT"; fail "hex init failed"; }
echo "$INIT_OUT"
grep -q "Detected Expo" <<<"$INIT_OUT" || fail "hex init did not detect Expo"
grep -q '"platform": "native"' hex.config.json || fail "hex.config.json is not marked native"
for f in global.css tailwind.config.js metro.config.js babel.config.js; do
	[ -f "$f" ] || fail "hex init did not write $f"
done
grep -q "@tailwind base" global.css || fail "global.css is not the NativeWind shape"
grep -q 'var(--' global.css && fail "global.css leaked a var() chain — native needs literal triplets"

step "hex add ${COMPONENTS[*]} (expects native-* resolution)"
ADD_OUT="$(node "$HEX_CLI" add "${COMPONENTS[@]}" --no-install -y 2>&1)" || { echo "$ADD_OUT"; fail "hex add failed"; }
echo "$ADD_OUT"
grep -q "Native project" <<<"$ADD_OUT" || fail "hex add did not resolve to the native catalog"
grep -q "not found" <<<"$ADD_OUT" && fail "hex add reported a missing component"
for slug in "${COMPONENTS[@]}"; do
	[ -f "components/ui/$slug.tsx" ] || fail "components/ui/$slug.tsx was not written"
	# Every native component draws its host elements from `react-native` or
	# from an `@rn-primitives/*` package — Switch, for one, imports only the
	# primitive. Requiring either is the check that means something.
	grep -qE 'from "(react-native|@rn-primitives/)' "components/ui/$slug.tsx" \
		|| fail "components/ui/$slug.tsx imports no React Native host — is it the web item?"
done
# The web catalog must never leak in. Any of these in an installed file means
# platform resolution handed the project a DOM component.
#
# Scans lib/ as well as components/ — `hex add` writes there too — and matches
# any DOM tag rather than just `<div ` with a trailing space, which `<div>`
# slipped straight past.
if grep -rqE '@radix-ui/|from "react-dom"|</?(div|span|button|p|ul|li|section|a)[ >/]' \
	components/ lib/ 2>/dev/null; then
	fail "a DOM-only import or element reached the native project"
fi

step "Installing dependencies"
# `expo install` resolves versions the installed SDK supports. Plain @latest
# would pull a react-native newer than the SDK and fail to bundle.
#
# `@rn-primitives/switch` backs the Switch component. The registry item
# declares it, and `hex add --no-install` above only printed the list, so the
# smoke test installs it here rather than pretending the component is
# dependency-free.
npx --yes expo install nativewind "tailwindcss@^3.4.0" babel-preset-expo clsx tailwind-merge class-variance-authority react-native-safe-area-context @rn-primitives/switch >/dev/null 2>&1 \
	|| fail "expo install failed"

step "Wiring global.css into the entry"
# hex init deliberately does not edit the entry file; the smoke test does what
# it tells the user to do, so the bundle actually includes the stylesheet.
ENTRY="App.tsx"
[ -f "$ENTRY" ] || ENTRY="App.js"
[ -f "$ENTRY" ] || fail "no App entry found to wire global.css into"
# Separate statements, not `printf … && mv`: in an `&&` chain a failed printf
# is exempt from `set -e`, so `mv` was skipped, the entry never got the import,
# and `expo export` still succeeded — a green smoke test that had not bundled
# the stylesheet at all.
printf 'import "./global.css";\n%s' "$(cat "$ENTRY")" > "$ENTRY.tmp" \
	|| fail "could not write $ENTRY.tmp"
mv "$ENTRY.tmp" "$ENTRY" || fail "could not move $ENTRY.tmp into place"
grep -q 'import "./global.css";' "$ENTRY" || fail "global.css import missing from $ENTRY"

step "Bundling with Metro (expo export)"
npx --yes expo export --platform ios --output-dir .expo-export >/dev/null 2>&1 \
	|| fail "expo export failed — the installed components do not bundle"

ls .expo-export/_expo/static/js/ios/*.hbc >/dev/null 2>&1 \
	|| ls .expo-export/_expo/static/js/ios/*.js >/dev/null 2>&1 \
	|| fail "expo export produced no iOS bundle"

printf '\n\033[32mNative smoke test passed.\033[0m\n'
printf 'Installed %s and bundled them for iOS.\n' "${COMPONENTS[*]}"
