# cssmodule-generator
##### A barebone and performant css module generator
A css parser and JavaScript, JSON and CSS genrator to help when applying the css module design pattern found in some react applications.

## How to setup
Yarn is recommended as a packet manager and a yarn.lock file is included to minimize the posibility of incompatible dependencies.

## How to build
Run the command `sh bin/build.sh` to populate ./lib and ./test with generated source code which is able to run in node js.

## How to build demo
Run the command `sh bin/build-demo.sh` to populate ./demo-data/build with built demo files which can be run in the browser.

## How to run 
`cssmodule-generate.sh {options} ...directories`
Example command `sh bin/cssmodule-generate.sh --pattern="{namespace}__{name}__{hash}" --namespace="demo" demo-data/`

## Options
- --pattern [{namespace}__{name}] The pattern to substitute using
- --namespace [path_to_file] The namespace which can be used in a substitution

- --outDir [.] The standard output directory root
- --jsOutDir [outDir] The js output directory root
- --cssOutDir [outDir] The css output directory root
- --jsonOutDir [outDir] The json output directory root

- --json [false] Shoud i generate Json?
- --noJs [false] Shoud skip generating javascript?
- --noCss [false] Shoud skip generating css?
- --modules [es6] The js module type (es6, amd, common)

- -v, --verbose [es6] The js module type (es6, amd, common)

## Available substitutions
- `{namespace}` => The provided namespace
- `{name}`      => The original selector (class or id)
- `{random}`    => A random string consisting of 7 characters
- `{unique}`    => An auto incrementing integer
- `{hash}`      => An identifier based on the selector content hash
