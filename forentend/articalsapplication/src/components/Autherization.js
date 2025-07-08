'use client';
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { validUser } from "../apis/login";

export default function Autherization({ children }) {
    const pathname = usePathname();
    let [isAccess, setIsAccess] = useState(pathname == "/login");
    const router = useRouter();
    useEffect(() => {
        async function checkUser() {
            let response = await validUser();
            if (response?.status === "success") {
                setIsAccess(true);
            } else {
                setIsAccess(false);
                localStorage.clear();
                router.push("/login");
            };
        };
        if (!isAccess) {
            checkUser();
        };
    }, []);
    return (
        <>
            {isAccess ? children : null}
        </>
    );
}