import Head from 'next/head'
import Header from '../components/Header'
import styled from 'styled-components'
import heroPic from "../../public/image/hero-portrait.jpg"
import Image from "next/image"

const HeroPortrait = () => {
    return <Image src={heroPic} width={300} height={400} alt="Richard Cool" />
}


export const Body = styled.div`
  position: relative;
  top: 5vh;
  background: ${(props) => props.theme.colors.sectionBackground}
`
export default function Home() {
    return (
        <div>
            <Head>
                <title>You have Dr. Cool</title>
            </Head>
            <Header />
            <Body>
                <h1>Helping Unleash the Power of Data With Custom Visualization, Analytic Tooling, and Predictive Modeling </h1>
                <h2>Empowering businesses to make better decisions and achieve your goals through actional insights and predictive analytics</h2>

                <HeroPortrait />

                <h3>Dr. Richard Cool</h3>
                <h4>Senior Data Scientist</h4>
                <h5>Netflix</h5>
            </Body>




        </div>
    )
}
