# cssmodule-generator
##### A barebone and performant css module generator
A css parser and JavaScript, JSON and CSS genrator to help when applying the css module design pattern found in some react applications.

## How to setup
Yarn is recommended as a packet manager and a yarn.lock file is included to minimize the posibility of incompatible dependencies.

## How to build
Run the command `sh bin/build.sh` to populate ./lib and ./test with generated source code which is able to run in node js.

## How to run 
Example command `sh bin/cssmodule-generate.sh demo-data/demo.css "{namespace}__{name}__{hash}" "demo"`

- Where `demo-data/demo.css` is the css file to compile
- Where `{namespace}__{name}__{hash}` is the substitution pattern to apply
- Where `"demo"` is the namespace to be substituted in

## Available substitutions
- `{namespace}` => The provided namespace
- `{name}`      => The original selector (class or id)
- `{random}`    => A random string consisting of 7 characters
- `{unique}`    => An auto incrementing integer
- `{hash}`      => A hash value of the selector contents
