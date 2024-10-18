import { Cl } from "@stacks/transactions";
import fs from "node:fs";
import { SimulationBuilder } from "stxer";
import { describe, it } from "vitest";

describe("Velar tests", () => {
  it("perform a swap", async () => {
    // tx: https://explorer.hiro.so/txid/0x9ee111a686a913abcf4489baf98d476f942a77122d8dd8ced18f7aa54809402e?chain=mainnet

    console.log(
      await SimulationBuilder.new()
        .withSender("SP3CTH7ZH5ESAA3VRZJZS78ERSMB457X0PNNRPF2R")
        .useBlockHeight(170327)
        .addContractDeploy({
          contract_name: "aggregator",
          source_code: fs.readFileSync("./contracts/aggregator.clar", "utf8"),
          fee: 0,
        })
        .addContractCall({
          contract_id: "SP3CTH7ZH5ESAA3VRZJZS78ERSMB457X0PNNRPF2R.aggregator",
          function_name: "swap",
          function_args: [
            Cl.uint(139165393), // amount-in
            Cl.some(Cl.uint(5000000000)), // maybe-amount-out-min
            Cl.none(), // maybe-alex-data
            Cl.some(
              Cl.tuple({
                // maybe-velar-data
                id: Cl.uint(21),
                token0: Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "velar-token",
                ),
                token1: Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "wstx",
                ),
                "token-in": Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "wstx",
                ),
                "token-out": Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "velar-token",
                ),
                "share-fee-to": Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "univ2-share-fee-to",
                ),
              }),
            ),
          ],
        })
        .run()
        .catch(console.log),
    );
  });
});
