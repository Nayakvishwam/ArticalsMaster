import Layout from "@/components/Layout";
import Autherization from "../../components/Autherization";

export default function AppLayout({ children }) {
    return (<>
        <Layout>
            <Autherization>
                {children}
            </Autherization>
        </Layout>
    </>)
};