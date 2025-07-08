import Autherization from "../../components/Autherization";

export default function AppLayout({ children }) {
    return (<>
        <Autherization>
            {children}
        </Autherization>
    </>)
};