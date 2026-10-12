import styles from './styles.module.css'

export default function SettingsLayout({
    children,
}:{
    children: React.ReactNode
}){
    return(
        <>
            <nav></nav>
            <main className={styles.main}>
                {children}
            </main>
        </>
    )
}