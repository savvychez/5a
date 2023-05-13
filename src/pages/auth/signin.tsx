import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth";
import Link from "next/link";


export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
        <div className="login-container flex text-md xl:text-lg min-h-screen flex-col items-center justify-center">
            <div className="login w-11/12 sm:w-10/12 md:w-7/12 lg:w-6/12 xl:w-4/12 "> 
            <div className="white-box bg-acid-white max-h-96 overflow-x-hidden px-4 py-4 xl:px-6 xl:py-6 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-2xl scroll-shadow">
                  <h1 className="bg-acid-white pb-4 "><strong>5a | </strong>login with your preferred provider</h1>
                  {Object.values(providers).map((provider) => (
                      <div key={provider.name}>
                      <button className="bg-acid-green w-full my-2 py-3 rounded-3xl border-2 border-acid-black hover:bg-acid-darkened-green " onClick={// eslint-disable-next-line @typescript-eslint/no-misused-promises 
                        async () => await signIn(provider.id)}>
                          sign in with {provider.name.toLocaleLowerCase()}
                      </button>
                      </div>
                  ))}
                </div>
                <p className=" mr-auto text-acid-green mt-2 xl:text-lg"><Link href="/" className="underline underline-offset-4	hover:no-underline">nevermind</Link></p>
            </div>
        </div>  

    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  
  return {
    props: { providers: providers ?? [] },
  }
}