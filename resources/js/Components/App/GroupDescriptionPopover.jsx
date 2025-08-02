import { Description, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

function GroupDescriptionPopover({description}) {
  return (
    <>
   
        <Popover className={`relative`}>
            {/* {({open})=>()} */}
            <PopoverButton className="block font-semibold text-gray-400 text-sm/6 focus:outline-none data-active:text-white data-focus:outline data-focus:outline-white data-hover:text-white">
            <ExclamationCircleIcon className='w-4'/>
          </PopoverButton>
          <PopoverPanel
            transition
            anchor="bottom"
            className="divide-y z-50 px-3 w-[200px]  divide-white/5 rounded-xl bg-white/5 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
            >
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                <div className="p-4 text-white bg-gray-800">
                    <h2 className="mb-3 text-lg">
                        Description
                    </h2>
                    {description && (
                        <div className="text-xs">
                            {description}
                        </div>
                    )}
                    {!description && (
                        <div className="py-4 text-xs text-center text-gray-500">
                            No Description
                        </div>
                    )}
                </div>
            </div>
          </PopoverPanel>
        </Popover>
    </>
  )
}

export default GroupDescriptionPopover