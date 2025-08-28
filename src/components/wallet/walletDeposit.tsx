import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export default function WalletDeposit () {
  return (
    <div className='px-4 flex flex-col w-full h-full gap-4 pt-8'>
      <div className='flex flex-col gap-2 w-full'>
        <label htmlFor='amount' className=' text-foreground text-sm'>
          Amount
        </label>
        <input
          type='text'
          placeholder='0'
          name='amount'
          className='w-full p-2 rounded border'
        />
        <div className='text-foreground self-end text-xs'>Balance: 0.1 ETH</div>
      </div>
      <Button
        variant={"outline"}

        className={`
           "`}
      >

          <Loader2 className='animate-spin' />

       deposit
      </Button>
      <div className='text-xs text-gray-400 self-center'>
        {" "}
        balance may take a few seconds to load. if it doesnt load after a few
        seconds, refresh the page
      </div>
    </div>
  );
};


