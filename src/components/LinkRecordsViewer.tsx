import { NextPage } from "next";

interface Record {
    slug: string;
    url: string;
}
  
interface Props {
    records: Record[];
}
  
const LinkRecordsViewer: NextPage<Props> = ({ records }) => {
    return (
        <div>
            <h1 className="bg-acid-white pb-2"><strong>your links</strong></h1>
            {Object.values(records).map((record) => (
                <div key={record.url} className="py-2">
                    <div className="relative flex bg-acid-white w-full my-2 py-6 rounded-md border-2 border-acid-black  overflow-hidden">
                        <div className="tools">
                        </div>
                        <p className="absolute right-4 text-right top-[0.6em]   ">{record.url}</p>
                        <div className={`absolute rotate-12 -top-[1.8em] -left-2 w-32 h-32  w-max bg-acid-green  z-0 transform border-r-2 border-acid-black transition-all duration-[700ms] z-0`}>
                            <p className="-rotate-12 px-6 py-[2.5em]  xl:py-[2.4em] z-3  font-medium">{"5a.vc/" + record.slug}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LinkRecordsViewer;
