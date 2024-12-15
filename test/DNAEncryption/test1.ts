import { expect } from "chai";
import { ethers } from "hardhat";

describe("DNAEncryption Contract", function () {
  let dnaEncryption: any;
  let owner: any;

  before(async function () {
    [owner] = await ethers.getSigners();

    // Deploy the DNAEncryption contract
    const DNAEncryptionFactory = await ethers.getContractFactory("DNAEncryption");
    dnaEncryption = await DNAEncryptionFactory.deploy();
  });

  it("should add genomic data for the user", async function () {
    const encryptedTraitRisk = 42 as any; // Mock encrypted value
    const encryptedIsCarrier = true as any; // Mock encrypted boolean

    await expect(dnaEncryption.addGenomicData(encryptedTraitRisk, encryptedIsCarrier))
      .to.emit(dnaEncryption, "GenomicDataAdded")
      .withArgs(owner.address);

    const [storedTraitRisk, storedIsCarrier] = await dnaEncryption.getGenomicData();
    expect(storedTraitRisk).to.equal(encryptedTraitRisk);
    expect(storedIsCarrier).to.equal(encryptedIsCarrier);
  });

  it("should process genetic insights for the user", async function () {
    const multiplier = 2 as any; // Mock multiplier
    const [encryptedTraitRisk] = await dnaEncryption.getGenomicData();

    const tx = await dnaEncryption.processGeneticInsights(multiplier);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === "GeneticInsightProcessed");
    expect(event?.args?.user).to.equal(owner.address);
    expect(event?.args?.encryptedRisk).to.equal(encryptedTraitRisk * multiplier); // Mock calculation
  });

  it("should encrypt multiple gene values and return encrypted equivalents", async function () {
    const genes = [1, 2, 3, 4]; // Mock gene values
    const encryptedGenes = await dnaEncryption.encryptGene(genes[0], genes[1], genes[2], genes[3]);

    expect(encryptedGenes.length).to.equal(4);

    genes.forEach((gene, index) => {
      expect(encryptedGenes[index]).to.not.equal(gene); // Mock check for encryption
    });
  });

  it("should compare two encrypted values", async function () {
    const value1 = 42 as any; // Mock encrypted value
    const value2 = 42 as any; // Mock encrypted value

    const [isEqual, isGreater] = await dnaEncryption.compareEncryptedValues(value1, value2);

    expect(isEqual).to.equal(true); // Mock comparison
    expect(isGreater).to.equal(false); // Mock comparison
  });
});
