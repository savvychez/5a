import { type NextComponentType } from "next";
import Image from "next/image";

import linkIcon from "../assets/link_icon.svg";
import redoIcon from "../assets/redo_icon.svg";
import copyIcon from "../assets/copy_icon.svg";

import { useState, useEffect, ChangeEvent } from 'react';
import ReactLoading from 'react-loading';
import Clipboard from 'react-clipboard.js';


const LinkShortenerInput: NextComponentType = () => {
  const [shrinkClicked, setShrinkClicked] = useState(false);
  const [opacityClass, setOpacityClass] = useState('opacity-0');
  const [records, setRecords] = useState([{"title":"hello"}]);
  const [slug, setSlug] = useState("");
  const [longURL, setLongURL] = useState("");


  async function postRequest() {
    const requestBody = {
      is_auth: true,
      email: "savvychez@gmail.com",
      long_url: longURL,
    };
  
    try {
      const response = await fetch("https://vakphsnnqnhsihwlcdkz.functions.supabase.co/new-shrink", {
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


  const handleShrinkClick = async () => {
    setShrinkClicked(true);
    postRequest().then((res) => {
      setSlug(res.slug)
    }).catch((error) => {
        // Handle error here
        console.error(error);
    });
  };

  const handleRedoClick = () => {
    setSlug("");
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLongURL(event.target.value);
  };

  useEffect(() => {
    if (slug) {
      setOpacityClass('opacity-100');
    }
  }, [slug]);

  return (
    <div className="input_container relative flex h-auto w-full mt-8 mb-8 border-2 border-acid-black rounded-3xl overflow-hidden focus-within:ring focus-within:ring-slate-300/50 active-within:ring-slate-300/75 ">
      <input value={longURL} onChange={handleInputChange} id="text_input" className="flex-grow block w-full px-5 py-3 bg-acid-white rounded-3xl shadow-sm placeholder-slate-400 focus:outline-none" placeholder="https://longurl.com" type="text" name="" />
      <button onClick={handleShrinkClick} className={`${shrinkClicked ? ' opacity-0 pointer-events-none' : ' opacity-100'} absolute border-none focus:ring-0 focus:shadow-none focus:border-none top-3 right-0 flex ml-5 pr-5 w-min justify-center items-center bg-acid-green focus:outline-none transition-opacity duration-700 z-10 font-medium`}>
        <p className="px-2 focus:ring-0 focus:shadow-none focus:outline-none">shrink</p>
        <Image src={linkIcon} alt="Shrink Button Image" className="" />
      </button>
      <div className={`absolute ${shrinkClicked ? '-top-10 right-0 w-[110%] h-32 rotate-0' : '-top-10 -right-8 xl:-right-6 w-32 h-32 rotate-12'}  bg-acid-green transform border-l-2 border-acid-black transition-all duration-[700ms] z-0`}></div>
      <div className={`${shrinkClicked ? 'opacity-100 delay-700 max-h-full duration-700' : 'opacity-0 pointer-events-none'} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity  	`}>
        {
          slug ?          
            <Clipboard className="flex items-center hover:mb-[2px] " data-clipboard-text={`https://5a.vc/${slug}`}>
              <h1 className={`transition-opacity duration-700 delay-100 ${opacityClass}`}><strong>5a.vc/{slug}</strong></h1>
              <Image src={copyIcon} alt="copy link" className="ml-2 w-4"/>
            </Clipboard>
          :        
            <ReactLoading color={"#242529"} type={"bars"} className="h-32" height={"0%"} width={25} />    
        }
      </div>
      <button onClick ={handleRedoClick} className="">
        <Image src={redoIcon} alt="Create new link" className={`${shrinkClicked ? 'opacity-100' : 'opacity-0'} absolute top-[15px]  right-5 w-[16px] delay-[700ms] transition-opacity duration-700 `} />
      </button>
      <h1>copied!</h1>
    </div>
  )
}

export default LinkShortenerInput;
