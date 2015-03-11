VAGRANTFILE_API_VERSION = '2'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.box = 'ubuntu/trusty64'
  config.vm.synced_folder '.', '/mnt/site'
  config.vm.network :private_network, ip: '192.168.55.55'
  config.hostsupdater.aliases = ['endpointsjs.loc']
  config.vm.define 'vagrant'
  config.vm.provision 'ansible' do |ansible|
    ansible.groups = {'localdev' => ['vagrant']}
    ansible.playbook = 'deploy/ansible/provision.yml'
  end
end
