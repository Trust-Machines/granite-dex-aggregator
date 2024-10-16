import { Cl } from "@stacks/transactions";
import fs from "node:fs";
import { SimulationBuilder } from "stxer";
import { describe, it } from "vitest";

describe("Velar tests", () => {
  it("perform a swap", async () => {
    // tx: https://explorer.hiro.so/txid/0x6cc6c630616368197b2253fa56d75d83cab242e7c26877b8f66d8386474edc0b?chain=mainnet

    console.log(
      await SimulationBuilder.new()
        .withSender("SP1GJSC4GG3MDA1KYZJYS9FEVCKHASR1N7089BEQK")
        .useBlockHeight(169842)
        .addContractDeploy({
          contract_name: "aggregator",
          source_code: fs.readFileSync("./contracts/aggregator.clar", "utf8"),
          fee: 0,
        })
        .addContractCall({
          contract_id: "SP1GJSC4GG3MDA1KYZJYS9FEVCKHASR1N7089BEQK.aggregator",
          function_name: "swap",
          function_args: [
            Cl.uint(718344), // amount-in
            Cl.some(Cl.uint(370)), // maybe-amount-out-min
            Cl.none(), // maybe-alex-data
            Cl.some(
              Cl.tuple({
                // maybe-velar-data
                id: Cl.uint(6),
                token0: Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "wstx",
                ),
                token1: Cl.contractPrincipal(
                  "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
                  "token-aeusdc",
                ),
                "token-in": Cl.contractPrincipal(
                  "SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K",
                  "token-aeusdc",
                ),
                "token-out": Cl.contractPrincipal(
                  "SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1",
                  "wstx",
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
