const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

try {
  process.loadEnvFile(path.join(__dirname, "../.env"));
} catch (_) {}

async function main() {
  console.log("==========================================");
  console.log("Deploying GasDiary to BOT Chain Testnet...");
  console.log("==========================================");

  let rawKey = process.env.PRIVATE_KEY;
  if (!rawKey) {
    throw new Error("PRIVATE_KEY is missing in .env file");
  }
  const privateKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;

  const rpcUrl = process.env.VITE_BOT_RPC_URL || "https://rpc.bohr.life";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deployer Address:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer Balance:", ethers.formatEther(balance), "BOT");

  if (balance === 0n) {
    console.warn("WARNING: Deployer wallet has 0 BOT. You need BOT testnet gas tokens to broadcast the contract deployment.");
  }

  const artifactPath = path.join(__dirname, "../src/contracts/artifacts/contracts/GasDiary.sol/GasDiary.json");
  if (!fs.existsSync(artifactPath)) {
    throw new Error("Contract artifact not found at " + artifactPath + ". Please run 'npm run compile' first.");
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("Broadcasting deployment transaction to BOT Chain...");
  const contract = await factory.deploy();
  console.log("Transaction Hash:", contract.deploymentTransaction()?.hash);

  console.log("Waiting for block confirmation...");
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("------------------------------------------");
  console.log(">>> GasDiary Contract Deployed Successfully! <<<");
  console.log("Contract Address:", address);
  console.log("Bohr Explorer URL:", `https://scan.bohr.life/address/${address}`);
  console.log("------------------------------------------");

  // Automatically update .env with deployed address
  const envPath = path.join(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("VITE_GAS_DIARY_CONTRACT=")) {
      envContent = envContent.replace(/VITE_GAS_DIARY_CONTRACT=.*/g, `VITE_GAS_DIARY_CONTRACT=${address}`);
    } else {
      envContent += `\nVITE_GAS_DIARY_CONTRACT=${address}\n`;
    }
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env with VITE_GAS_DIARY_CONTRACT=" + address);
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
