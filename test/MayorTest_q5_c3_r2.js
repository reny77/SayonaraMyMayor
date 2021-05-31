const truffleAssert = require('truffle-assertions');

const Mayor = artifacts.require('Mayor')

contract("Testing mayor_or_sayonara q=5 confirm=3 reject=2", accounts => {
  let quorum = 5; // test quorum
  let confirm = 3;
  let reject = quorum - confirm;  
  let testSoul = 1000; // a base test soul

  it("Testing mayor_or_sayonara", async function() {
    const instance = await Mayor.new(accounts[0], accounts[1], quorum);
    let voterIdx = 0;
    for (let i = 0; i < confirm; i++) {
      const envelops = await instance.compute_envelope(voterIdx, true, testSoul);
      await instance.cast_envelope(envelops, { from: accounts[voterIdx + 2] });
      voterIdx++;
    }
    
    for (let i = 0; i < reject; i++) {
      const envelops = await instance.compute_envelope(voterIdx, false, testSoul);
      await instance.cast_envelope(envelops, { from: accounts[voterIdx + 2] });
      voterIdx++;
    }

    voterIdx = 0;
    for (let i = 0; i < confirm; i++) {
      await instance.open_envelope(voterIdx, true, { from: accounts[voterIdx + 2], value: testSoul });
      voterIdx++;
    }
    
    for (let i = 0; i < reject; i++) {
      await instance.open_envelope(voterIdx, false, { from: accounts[voterIdx + 2], value: testSoul });
      voterIdx++;
    }
    
    const result = await instance.mayor_or_sayonara();    
    truffleAssert.eventEmitted(result, "NewMayor");
  });

});