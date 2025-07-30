import MainNavbar from "./MainNavbar";

export default function MainLayout({ children }) {
    return (
        <>
            <MainNavbar />
            {children}
        </>
    )
}