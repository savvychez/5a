import { type NextPage } from "next";
import { Space_Grotesk, Spectral } from 'next/font/google';
import Head from "next/head";

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import LinkShortenerInput from "~/components/LinkShortenerInput";
import LinkRecordsViewer from "~/components/LinkRecordsViewer";

const spacegrot = Space_Grotesk({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"]
})



const Home: NextPage = () => {
  const [shrinkClicked, setShrinkClicked] = useState(false);
  const [records, setRecords] = useState([{"url":"hello", "slug":"WX"}, {"url":"otherr", "slug":"as"}, {"url":"z3", "slug":"WXsd"}]);
  const { data: session } = useSession();


  async function postRequest() {
    const requestBody = {
      is_auth: true,
      email: "savvychez@gmail.com",
    };
  
    try {
      const response = await fetch("https://vakphsnnqnhsihwlcdkz.functions.supabase.co/get-links-from-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
  
      const data = await response.json();
      return data
    } catch (error) {
      console.error("Request failed:", error);
      return "ERROR"
    }
  }

  const getRecords = async () => {
    let res = await postRequest()
    setRecords(res)
  }

  const handleClick = () => {
    setShrinkClicked(!shrinkClicked);
    // alert("hey")
    // alert(JSON.stringify(session))
  };



  useEffect(() => {
    // if (!(session && session.user && session.user.email)) {
    //   setRecords([])
    //   return
    // }
    getRecords()
  }, [session]);


  return (
    <>
      <Head>
        <title>5a | link shrinker</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={spacegrot.className + " relative flex text-md  min-h-screen flex-col items-center justify-center bg-acid-black "}>
        <div className="main-box  w-11/12 sm:w-10/12 md:w-7/12 lg:w-6/12 xl:w-4/12  xl:text-[1.1em] ">
        <div className="white-box bg-acid-white max-h-96 overflow-scroll px-4 py-4 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-md  ">
            <h1 className="bg-acid-white "><strong>5a | </strong> the link shrinker</h1>
            <LinkShortenerInput/>
            {session && session.user && session.user.email ?
            (
             <LinkRecordsViewer records={records}/>
            )
            :
            null
            }
            
          </div>
          {/* {
            !(session && session.user && session.user.email) ? 
              (<p className="justify-self-start mr-auto text-acid-green mt-2 "><button onClick={() => signIn()} className="underline underline-offset-4	hover:no-underline">use an account</button> &nbsp;to save and manage links</p>) :
            <p className="justify-self-start mr-auto text-acid-green mt-2">{session.user.email} | <button onClick={() => signOut()} className="underline underline-offset-4	hover:no-underline">sign out</button></p>
          } */}
        </div>
        
      </main>
    </>
  );
};

export default Home;
