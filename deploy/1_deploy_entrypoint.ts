import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { Create2Factory } from '../src/Create2Factory';
import { ethers } from 'hardhat';

module.exports = async ({ deployments: any }) => {
  const { deploy } = deployments;

  const provider = ethers.provider;
  const from = await provider.getSigner().getAddress();

  console.log(from);
  // await new Create2Factory(ethers.provider).deployFactory();

  // const ret = await deploy('EntryPoint', {
  //   from,
  //   args: [],
  //   gasLimit: 6e6,
  //   deterministicDeployment: true,
  // });

  // console.log('==entrypoint addr=', ret.address);
};
module.exports.tags = ['EntryPoint'];
