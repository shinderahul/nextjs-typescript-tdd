'use client';

import { ChangeEvent, useEffect, useState } from "react";
import useDebounce from "./hooks/useDebounce";

interface User {
    id: number;
    name: string;
}

export default function AutoComplete() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/users');
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }, [])


    useEffect(() => {
        if (debouncedQuery) {
            const result = users.filter((users) => users.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
            setFilteredUsers(result);
        } else {
            setFilteredUsers([]);
        }
    }, [users, debouncedQuery]);


    return (
        <div>
            <h1>AutoComplete</h1>
            <input
                type="text"
                className="w-md p-2 border border-gray-300 rounded"
                placeholder="Search user by name..."
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            />
            {filteredUsers.length > 0 && (
                <ul className="border border-gray-200 rounded mt-2 bg-black shadow-md">
                    {filteredUsers.map((user) => (
                        <li key={user.id} className="p-2 hover:bg-gray-900 cursor-pointer">
                            {user.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
