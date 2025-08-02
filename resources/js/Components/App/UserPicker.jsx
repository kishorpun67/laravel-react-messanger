import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import clsx from 'clsx'

function UserPicker({value, options, onSelect}) {
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState(value)
    const filteredPeople =
      query === ''
        ? options
        : options.filter((person) => {
            return person.name.toLowerCase().includes(query.toLowerCase())
          })
    
    // console.log('value', filteredPeople)

    const onSelected = (persons) =>{
        setSelected(persons)
        onSelect(persons)
    }
    return (
        <>
            <Combobox value={selected} onChange={onSelected} >
                <div className="relative mt-1">
                    {/* <div className="relative w-full overflow-hidden text-left rounded-lg shadow-md curs or-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"> */}
                        <ComboboxInput
                            className={clsx(
                            'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                            )}
                            displayValue={(persons) => 
                                persons.length
                                    ? `${persons.length} user selected`:""
                            }
                            placeholder='Select users...'
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <ComboboxButton 
                            className="group absolute inset-y-0 right-0 px-2.5"
                            >
                            <ChevronDownIcon    
                                className="size-4 fill-white/60 group-data-hover:fill-white" 
                                // className='w-5 h-5 text-gray-400'
                            />
                        </ComboboxButton>
                    {/* </div> */}
                </div>
                {/* <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                    )}
                    >
                    {filteredPeople.length > 0 && query == '' ?
                        (
                            <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                                Noting found
                            </div>
                        )
                        : 
                        (
                            filteredPeople.map((person) => (
                                <ComboboxOption
                                key={person.id}
                                value={person}
                                className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                                >
                                <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                                <div className="text-white text-sm/6">{person.name}</div>
                                </ComboboxOption>
                            ))
                        )
                    }
                </ComboboxOptions> */}
                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                    )}
                    >
                    {filteredPeople.map((person) => (
                        <ComboboxOption
                        key={person.id}
                        value={person}
                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white/10"
                        >
                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                        <div className="text-white text-sm/6">{person.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
            {
                selected && (
                    <div className="flex gap-2 mt-3">
                        {selected.map((person)=>(
                            <div key={person.id}  className="gap-2 badge badge-primary">
                                {person.name}
                            </div>
                        ))}
                    </div>
                )
            }
        </>
    )
}

export default UserPicker