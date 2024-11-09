import { initialize, getKeyringFromSeed } from "avail-js-sdk"
import { ISubmittableResult } from "@polkadot/types/types/extrinsic"
import { H256 } from "@polkadot/types/interfaces/runtime"

import config from "../../config"

const main = async () => {
  try {
    const api = await initialize(config.endpoint)
    const account = getKeyringFromSeed(config.seed)
    // Transaction call
    const key = "my-key-name"
    const txResult = await new Promise<ISubmittableResult>((res) => {
      api.tx.dataAvailability.createApplicationKey(key).signAndSend(account, (result: ISubmittableResult) => {
        console.log(`Tx status: ${result.status}`)
        if (result.isFinalized || result.isError) {
          res(result)
        }
      })
    })
    // Rejected Transaction handling
    if (txResult.isError) {
      console.log(`Transaction was not executed`)
      process.exit(1)
    }
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
main()
