import { MouseEvent } from "react";
import { Button } from "../ui/button";

type Props = {
    onCancel: () => void;
    onConfirm: (event: MouseEvent<HTMLElement>) => void;
};

export function ModalFooter({ onCancel, onConfirm }: Props) {
    return (
        <>
            <Button variant="destructive" onClick={onConfirm}>
                Delete
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
        </>
    );
}
