import Previous from "@/components/Previous";
import TranscriptionPage from "./Add";

export default function page() {
    return (
        <div>
        {/*
            TODO: after the the upload is done there needs to be a js change in the Previous component
            */}
            <TranscriptionPage></TranscriptionPage>
            <div className="mx-auto w-[54rem]">
                <Previous></Previous>
            </div>
        </div>
    )
}

