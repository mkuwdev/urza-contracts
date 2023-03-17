import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

module.exports = async ({ deployments: any }) => {
  //   const { deploy } = deployments;
  //   const provider = ethers.provider;
  //   const from = await provider.getSigner().getAddress();
  //   console.log(from);
  //   const entrypoint = await deployments.get('EntryPoint');
  //   const ret = await deploy('GnosisSafeAccountFactory', {
  //     from,
  //     args: [entrypoint.address],
  //     gasLimit: 6e6,
  //     deterministicDeployment: true,
  //   });
  //   console.log('==GnosisAccountFactory addr=', ret.address);
};
module.exports.tags = ['GnosisAccountFactory'];
