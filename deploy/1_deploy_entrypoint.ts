import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { Create2Factory } from '../src/Create2Factory';
import { ethers } from 'hardhat';

const deployEntryPoint: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { deployments } = hre;
  const { deploy } = deployments;

  const provider = ethers.provider;
  const from = await provider.getSigner().getAddress();

  console.log('Using Address:', from);
  await new Create2Factory(ethers.provider).deployFactory();

  const entryPoint = await deploy('EntryPoint', {
    from,
    args: [],
    gasLimit: 6e6,
    deterministicDeployment: true,
  });

  console.log('== Entrypoint Address == ', entryPoint.address);
};

deployEntryPoint.tags = ['EntryPoint'];

export default deployEntryPoint;
