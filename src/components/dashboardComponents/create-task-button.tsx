import React from 'react'
import { SlNote } from "react-icons/sl";
import { Button } from "../ui/button";
import Link from "next/link";

function Createtaskbutton() {
  return (
            <Link href={"/dashboard/createtask"}>
          <Button variant={"outline"} className='bg-background'>
            <SlNote className='' />
            Create New Task
          </Button>
        </Link>
  )
}

export default Createtaskbutton