# endpoints deployment
> put it on the web

Endpoints is deployed to Amazon EC2 using Ansible. Until Ansible supports
Windows, a Linux or OSX host is required. Further system requirements are
listed at the bottom of this document.

## Deploying

A few bash helper scripts have been created to facilitate deploying and
optionally passing extra vars.

* [provision.sh](provision.sh) - Perform base, configure, nginx, deploy roles.
  This script must be run when a production box is first set up.
* [deploy.sh](deploy.sh) - Perform only deploy role. This is much faster than
  provisioning, but only works if the box has already been provisioned.

#### Notes

* You may pass flags to this script as you might to `ansible-playbook`. Eg:
  `--help` for help or `-vvvv` for connection debugging.
* You may specify any number of extra vars in the format `varname=value`.
* If prompted for a password, enter your dploy shadow password.
* [deploy.sh](deploy.sh) is really just a symlink to
  [provision.sh](provision.sh). The bash script is smart enough to find a
  same-named playbook in the [ansible](ansible) directory; should you need to
  create another playbook, just create another symlinked bash script.

#### Options

* `commit` - Defaults to `master`. Specify any ref (eg. branch, tag) or SHA to
  be deployed.
* `force` - Defaults to `false`. If the specified commit SHA has already been
  deployed, it won't be re-cloned or re-built unless this is `true`.

#### Examples

* Assume these examples are run from the root directory of your repository.
* Don't type in the `$`, that's just there to simulate the shell prompt.

```bash
# Provision the box and deploy the current HEAD of master, symlinking it and
# making it live.

$ deploy/provision.sh

# If the current commit at the HEAD of my-feature was previously deployed, this
# won't rebuild it. However, it will still be symlinked and made live. If the
# HEAD has changed since it was last deployed, and that commit hasn't yet been
# deployed, it will be cloned and built before being symlinked and made live.

$ deploy/deploy.sh commit=my-feature

# Regardless of the prior deploy state of commit at the HEAD of the my-feature
# branch, re-clone and rebuild it before symlinking it and making it live.

$ deploy/deploy.sh commit=my-feature force=true
```

### System Requirements to Deploy to Production

* **Ansible**
  - Install `ansible` via apt (Ubuntu), yum (Fedora), [homebrew][homebrew] (OS
    X), etc. See the [Ansible installation
    instructions](http://docs.ansible.com/intro_installation.html) for
    detailed, platform-specific information.

### System Requirements to Test Deployment in Vagrant

* **VirtualBox**
  - [Download](https://www.virtualbox.org/wiki/Downloads) (All platforms)
  - Install `virtualbox` via [homebrew cask][cask] (OS X)
* **Vagrant**
  - [Download](http://docs.vagrantup.com/v2/installation/) (All platforms)
  - Install `vagrant` via [homebrew cask][cask] (OS X)
* **vagrant-hostsupdater**
  - Install with `vagrant plugin install vagrant-hostsupdater` (All platforms)

[homebrew]: http://brew.sh/
[cask]: http://caskroom.io/
