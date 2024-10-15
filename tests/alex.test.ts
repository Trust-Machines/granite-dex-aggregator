import { Cl } from "@stacks/transactions";
import fs from "node:fs";
import { SimulationBuilder } from "stxer";
import { describe, it } from "vitest";

describe("Alex tests", () => {
  it("perform a swap", async () => {
    // tx: https://explorer.hiro.so/txid/0xe4dbbcbb9c17d88e1192105567a1cda0fd019457fa7a845e17a17a536dc73da0?chain=mainnet

    console.log(
      await SimulationBuilder.new()
        .withSender("SP1KS4SMA7018Z39TH93A2BY0SDFAWBZ9C4NFTEY")
        .useBlockHeight(169852)
        .addContractDeploy({
          contract_name: "aggregator",
          source_code: fs.readFileSync("./contracts/aggregator.clar", "utf8"),
          fee: 0,
        })
        .addContractCall({
          contract_id: "SP1KS4SMA7018Z39TH93A2BY0SDFAWBZ9C4NFTEY.aggregator",
          function_name: "swap",
          function_args: [
            Cl.uint(41431655000000000n), // amount-in
            Cl.some(Cl.uint(63285131)), // maybe-amount-out-min
            Cl.some(
              Cl.tuple({
                // maybe-alex-data
                token0: Cl.contractPrincipal(
                  "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM",
                  "token-wall",
                ),
                token1: Cl.contractPrincipal(
                  "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM",
                  "token-wstx-v2",
                ),
                factor: Cl.uint(100000000),
              }),
            ),
            Cl.none(), // maybe-velar-data
          ],
        })
        .run()
        .catch(console.log),
    );
  });
});
