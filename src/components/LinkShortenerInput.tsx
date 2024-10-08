import { type NextComponentType } from "next";
import Image from "next/image";

import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept, generatePermittedFileTypes } from "uploadthing/client";
import { useUploadThing } from "~/components/uploadthing";


declare module "*.svg" {
  const content: any;
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import linkIcon from "../assets/link_icon.png";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import redoIcon from "../assets/redo_icon2.png";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import copyIcon from "../assets/copy_icon.svg";

import { useState, useEffect, ChangeEvent, useCallback, forwardRef, useImperativeHandle } from 'react';
import ReactLoading from 'react-loading';
import Clipboard from 'react-clipboard.js';
import { set } from "zod";


const LinkShortenerInput: NextComponentType = forwardRef((props, ref) => {
  const [shrinkClicked, setShrinkClicked] = useState(false);
  const [opacityClass, setOpacityClass] = useState('opacity-0');
  const [records, setRecords] = useState([{"title":"hello"}]);
  const [message, setMessage] = useState({text: "", color: "text-green-500"});
  const [slug, setSlug] = useState("");
  const [longURL, setLongURL] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setShrinkClicked(true);
    if (acceptedFiles[0]) {
      startUpload([acceptedFiles[0]]).then((url) => {
        if (url && url[0]) {
          postRequest(url[0].url).then((res) => {
            setSlug(res.slug)
            setFile(null);
          }).catch((error) => {
            console.error(error);
          })
        }
      }
      ).catch((error) => {
        console.error(error);
        setFile(null);
      });
      return;
    }
    // if (acceptedFiles[0]) {
    //   setFile(acceptedFiles[0]);
    // }
  }, []);

  const handleFileUpload = (file: File) => {
    setShrinkClicked(true);
    if (file) {
      console.log("file is", file);
      startUpload([file]).then((url) => {
        if (url && url[0]) {
          postRequest(url[0].url).then((res) => {
            setSlug(res.slug)
            setFile(null);
          }).catch((error) => {
            console.error(error);
          })
        }
      }
      ).catch((error) => {
        console.error("error here");
        console.error(error);
        setFile(null);
      });
      return;
    }
  };

  useImperativeHandle(ref, () => ({
    handleFileUpload,
  }));

  const { startUpload, routeConfig } = useUploadThing("fileUploader", {
    onClientUploadComplete: (url) => {
      // alert("uploaded successfully!");
      // alert("file url is " + url);
    },
    onUploadError: (err) => {
      alert("error occurred while uploading! try again later");
      console.log(err)
    },
    onUploadBegin: (file) => {
      console.log("upload has begun for", file);
    },
  });

  const { getRootProps, getInputProps, isDragAccept } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
    maxFiles: 1,
    multiple: false,
  });

  async function postRequest(forceURL?: string) {
    const requestBody = {
      is_auth: true,
      email: "savvychez@gmail.com",
      long_url: forceURL || longURL,
    };
  
    try {
      const response = await fetch("https://vakphsnnqnhsihwlcdkz.supabase.co/functions/v1/new-shrink", {
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
      
      type Response = {
        slug: string;
      }
      const data: Response = await response.json() as Response;

      type RetRes = {
        slug: string;
        success: boolean;
      }
      const retRes: RetRes = {
        slug: data.slug,
        success: true,
      }


      return retRes
    } catch (error) {
      console.error("Request failed:", error);
      type RetRes = {
        slug: string;
        success: boolean;
      }
      const retRes: RetRes = {
        slug: "",
        success: false,
      }
      return retRes
    }
  }

  const isValidUrl = (url: string)  => {
    try { 
      return Boolean(new URL(url)); 
    }
    catch(e){ 
      return false; 
    }
  }

  const handleShrinkKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleShrinkClick();
    }
  }


  const handleShrinkClick = () => {
    if(!isValidUrl(longURL) && file === null) {
      // alert("Please enter a valid URL");
      setMessage({text: "please enter a valid URL", color: "text-red-500"});
      return;
    } 

    setShrinkClicked(true);

    if (file) {
      startUpload([file]).then((url) => {
        // console.log("uploaded successfully");
        // console.log("file url is " + url);
        if (url && url[0]) {
          postRequest(url[0].url).then((res) => {
            setSlug(res.slug)
            setFile(null);
          }).catch((error) => {
            console.error(error);
          })
        }
      }
      ).catch((error) => {
        console.error(error);
        setFile(null);
      });
      return;
    }
    postRequest().then((res) => {
      setSlug(res.slug)
    }).catch((error) => {
        // Handle error here
        console.error(error);
    });
  };

  const handleRedoClick = () => {
    setSlug("");
    setLongURL("");
    setFile(null);
    setShrinkClicked(false);
    setOpacityClass('opacity-0');
  };

  const clickedboard = () => {
    setMessage({text: "copied!", color: "text-green-800"});
    setTimeout(() => {
      setMessage({} as {text: string; color: string;});
    }, 1000);
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage({} as {text: string; color: string;});
    setLongURL(event.target.value);
  };

  useEffect(() => {
    if (slug) {
      setOpacityClass('opacity-100');
    }
  }, [slug]);

  return (
    <div className="input_and_message" {...getRootProps()} onClick={(event: React.MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
      <div className="input_container relative flex h-auto w-full mt-8 border-2 border-acid-black overflow-hidden focus-within:ring focus-within:ring-slate-300/50 active-within:ring-slate-300/75 rounded-md">
      {/* <input type="text" name="" id="" /> */}
      <input value={longURL} onChange={handleInputChange} onKeyDown={handleShrinkKeyDown} id="text_input" className="rounded-md flex-grow block w-full px-5 py-3 bg-acid-white shadow-sm placeholder-slate-400 focus:outline-none" placeholder="drag a file over or type a URL!" type="text" name="" />
      <button onClick={handleShrinkClick} className={`${shrinkClicked || isDragAccept   ? ' opacity-0 pointer-events-none' : ' opacity-100'} absolute rounded-md border-none focus:ring-0 focus:shadow-none focus:border-none top-3 right-0 flex ml-5 pr-5 w-min justify-center items-center bg-acid-green focus:outline-none transition-opacity duration-700 z-10 font-medium`}>
        <p className="pl-2 focus:ring-0 focus:shadow-none focus:outline-none">shrink</p>
        <Image src={linkIcon} width={25} height={25} alt="Shrink Button Image" className="mr-1" />
      </button>
      <div className={`absolute ${shrinkClicked || isDragAccept ? '-top-10 right-0 w-[110%] h-32 rotate-0' : '-top-10 -right-8 xl:-right-6 w-32 h-32 rotate-12'} bg-acid-green transform border-l-2 border-acid-black transition-all duration-[700ms] z-0`}></div>
      <div className={`${shrinkClicked || isDragAccept ? 'opacity-100 delay-700 max-h-full duration-700' : 'opacity-0 pointer-events-none'} ${isDragAccept ? ' duration-100 delay-200 ' : ''} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity`}>
        {
        slug ?
          <Clipboard className="flex items-center hover:mb-[2px]" data-clipboard-text={`https://5a.vc/${slug}`} onClick={clickedboard}>
          <h1 className={`transition-opacity duration-700 delay-100 ${opacityClass}`}><strong>5a.vc/{slug}</strong></h1>
          <Image src={copyIcon} alt="copy link" className="ml-2 w-4" />
          </Clipboard>
          : !isDragAccept && shrinkClicked ?
            <ReactLoading color={"#242529"} type={"bars"} className="h-32" height={"0%"} width={25} />
            : null
        } 
        {
          isDragAccept ?
            <h1 className="text-acid-black font-medium duration-0 delay-0">drop file to upload!</h1>: null
        }
      </div>
      <button onClick={handleRedoClick} className="">
        <Image src={redoIcon} width={10} height={10} alt="Create new link" className={`${shrinkClicked ? 'opacity-100' : 'opacity-0'} absolute top-[15px] right-5 w-[16px] delay-[700ms] transition-opacity duration-700`} />
      </button>
      </div>
      <h1 className={"block mb-1 mt-3 text-md transition-opacity duration-100 " + message.color}>{message.text}&nbsp;</h1>
    </div>
  )
})

export default LinkShortenerInput;
