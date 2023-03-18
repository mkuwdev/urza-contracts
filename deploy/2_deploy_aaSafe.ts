import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { Create2Factory } from '../src/Create2Factory';
import { ethers } from 'hardhat';

const deployAASafe: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;
  const { deploy } = deployments;

  const provider = ethers.provider;
  const from = await provider.getSigner().getAddress();

  const safeSingleton = await deploy('GnosisSafe', {
    from,
    args: [],
    gasLimit: 6e6,
    deterministicDeployment: true,
  });

  console.log('== Safe Address == ', safeSingleton.address);

  const proxyFactory = await deploy('GnosisSafeProxyFactory', {
    from,
    args: [],
    gasLimit: 6e6,
    deterministicDeployment: true,
  });

  console.log('== Safe Proxy Factory Address == ', proxyFactory.address);

  const entrypoint = await deployments.get('EntryPoint');
  const manager = await deploy('EIP4337Manager', {
    from,
    args: [entrypoint.address],
    gasLimit: 6e6,
    deterministicDeployment: true,
  });

  console.log('== Manager Address == ', manager.address);

  const accountFactory = await deploy('GnosisSafeAccountFactory', {
    from,
    args: [proxyFactory.address, safeSingleton.address, manager.address],
    gasLimit: 6e6,
    deterministicDeployment: true,
  });

  console.log('== Safe Account Factory Address == ', accountFactory.address);
};

deployAASafe.tags = [
  'GnosisSafe',
  'GnosisSafeProxyFactory',
  'EIP4337Manager',
  'GnosisSafeAccountFactory',
];

export default deployAASafe;
