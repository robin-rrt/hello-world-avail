import { initialize, getKeyringFromSeed } from "avail-js-sdk"
import { ISubmittableResult } from "@polkadot/types/types/extrinsic"
import { H256 } from "@polkadot/types/interfaces/runtime"

const main = async () => {
  try {
    //initialize sdk
    const api = await initialize("wss://turing-rpc.avail.so/ws")

    // get your Avail account
    const account = getKeyringFromSeed("enter your avail seed")
    console.log(account.address)

    const data = "Hello World"

    // submit the data using dataAvailability.submitData extrinsic
    const txResult = await new Promise<ISubmittableResult>((res) => {
      api.tx.dataAvailability.submitData(data).signAndSend(account, (result: ISubmittableResult) => {
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
 
  process.exit()
} catch (err) {
    console.error(err)
    process.exit(1)
  }}
main()