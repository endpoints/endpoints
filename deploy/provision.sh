#!/usr/bin/env bash

# Written by Ben "Cowboy" Alman. Feel free to ask if you have any questions!

if [[ ! "$(type -P ansible-playbook)" ]]; then
  echo "Error: ansible-playbook must be installed and in the PATH."
  exit 1
fi

inventory=inventory/production
playbook="$(basename "$0" .sh)".yml # bash-script-named playbook

# cd to the directory of this bash script
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir/ansible"

# Pass args starting with - (hypen) through to ansible-playbook as-is,
# otherwise precede them with --extra-vars.
args=()
for arg in "$@"; do
  [[ "$arg" =~ ^- ]] || args=("${args[@]}" "--extra-vars")
  args=("${args[@]}" "$arg")
done

command=(ansible-playbook -i "$inventory" "$playbook" "${args[@]}")
cat <<EOF
You may pass flags to this script as you might to ansible-playbook.
Eg: --help for help or -vvvv for connection debugging.

You may specify any number of extra vars in the format varname=value.
Eg: $(basename "$0") commit=master force=true

Running command: cd "$(pwd)" && ${command[@]}

If prompted for a password, enter your shadow password from group_vars/all.yml

EOF

"${command[@]}"
