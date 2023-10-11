import { Ed25519Program, TransactionInstruction } from "@solana/web3.js";
import * as BufferLayout from "@solana/buffer-layout";
import { WITHDRAW_MESSAGE_SIZE } from "./constant";


const U16_MAX = 0xFFFF;

const SIGNATURE_SIZE = 64;
const PUBLIC_KEY_SIZE = 32;

export type CreateEd25519InstructionParams = {
    message: Uint8Array
    signatureInfos: SignatureInfo[]
}

export type SignatureInfo = {
    signature: Uint8Array
    publicKey: Uint8Array
}

const ED25519_SIGNATURE_COUNT_LAYOUT = BufferLayout.struct<
    Readonly<{
        numSignatures: number
        padding: number
    }>
>([
    BufferLayout.u8("numSignatures"),
    BufferLayout.u8("padding"),
]);

const ED25519_SIGNATURE_OFFSETS_LAYOUT = BufferLayout.struct<
    Readonly<{
        signatureOffset: number
        signatureInstructionIndex: number
        publicKeyOffset: number
        publicKeyInstructionIndex: number
        messageDataOffset: number
        messageDataSize: number
        messageInstructionIndex: number
    }>
>([
    BufferLayout.u16("signatureOffset"),
    BufferLayout.u16("signatureInstructionIndex"),
    BufferLayout.u16("publicKeyOffset"),
    BufferLayout.u16("publicKeyInstructionIndex"),
    BufferLayout.u16("messageDataOffset"),
    BufferLayout.u16("messageDataSize"),
    BufferLayout.u16("messageInstructionIndex"),
]);

const ED25519_SIGNATURE_LAYOUT = BufferLayout.struct<
    Readonly<{
        signature: number[]
        publicKey: number[]
    }>
>([
    BufferLayout.seq(BufferLayout.u8(), SIGNATURE_SIZE, "signature"),
    BufferLayout.seq(BufferLayout.u8(), PUBLIC_KEY_SIZE, "publicKey"),
]);

const SIZE_PER_SIGNATURE = ED25519_SIGNATURE_OFFSETS_LAYOUT.span + ED25519_SIGNATURE_LAYOUT.span;

export function makeEd25519Instruction({
    message,
    signatureInfos,
}: CreateEd25519InstructionParams): TransactionInstruction {
    const signaturesCount = signatureInfos.length;
    const instructionDataSize = ED25519_SIGNATURE_COUNT_LAYOUT.span
        + signaturesCount * SIZE_PER_SIGNATURE
        + WITHDRAW_MESSAGE_SIZE;

    const instructionData = Buffer.alloc(instructionDataSize);
    let offset = 0;
    ED25519_SIGNATURE_COUNT_LAYOUT.encode(
        {
            numSignatures: signaturesCount,
            padding: 0,
        },
        instructionData,
        offset,
    );
    offset += ED25519_SIGNATURE_COUNT_LAYOUT.span;

    const messageDataOffset = ED25519_SIGNATURE_COUNT_LAYOUT.span
        + signaturesCount
        * (ED25519_SIGNATURE_OFFSETS_LAYOUT.span + ED25519_SIGNATURE_LAYOUT.span);

    if (message.length !== WITHDRAW_MESSAGE_SIZE) {
        throw new Error(`Message length != ${WITHDRAW_MESSAGE_SIZE}`);
    }
    instructionData.fill(
        message,
        messageDataOffset,
        messageDataOffset + message.length,
    );

    for (const [i, info] of signatureInfos.entries()) {
        if (info.signature.length !== SIGNATURE_SIZE) {
            throw new Error(`Signature ${i} length != ${SIGNATURE_SIZE}`);
        }
        if (info.publicKey.length !== PUBLIC_KEY_SIZE) {
            throw new Error(`Public key ${i} length != ${PUBLIC_KEY_SIZE}`);
        }

        const signatureOffset = ED25519_SIGNATURE_COUNT_LAYOUT.span
            + signaturesCount * ED25519_SIGNATURE_OFFSETS_LAYOUT.span
            + i * ED25519_SIGNATURE_LAYOUT.span;
        const publicKeyOffset = signatureOffset + SIGNATURE_SIZE;
        ED25519_SIGNATURE_OFFSETS_LAYOUT.encode(
            {
                signatureOffset,
                signatureInstructionIndex: U16_MAX,
                publicKeyOffset: publicKeyOffset,
                publicKeyInstructionIndex: U16_MAX,
                messageDataOffset,
                messageDataSize: WITHDRAW_MESSAGE_SIZE,
                messageInstructionIndex: U16_MAX,
            },
            instructionData,
            offset,
        );
        offset += ED25519_SIGNATURE_OFFSETS_LAYOUT.span;

        instructionData.fill(
            info.signature,
            signatureOffset,
            signatureOffset + info.signature.length,
        );

        instructionData.fill(
            info.publicKey,
            publicKeyOffset,
            publicKeyOffset + info.publicKey.length,
        );
    }

    return new TransactionInstruction({
        keys: [],
        programId: Ed25519Program.programId,
        data: instructionData,
    });
}
