import { NextResponse } from "next/server";
import { TVersion } from "./version.interface";
import { VersionService } from "./version.service";
import { ClientSession } from "mongoose";

const createAVersion = async (data: Partial<TVersion>, options?: {session?: ClientSession}) =>
{
    try {
        const result = await VersionService.createAVersion(data, options)
        return NextResponse.json({
            success: true,
            message: "Version created successfully",
            data: result 
        })
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to create a new version",
            error: error
        })        
    }
}

export const VersionController = {createAVersion}
