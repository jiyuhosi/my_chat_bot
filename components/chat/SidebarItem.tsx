"use client";
import Link from "next/link";
import { ChangeEvent, MouseEvent, ReactNode, useState, KeyboardEvent, useRef, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSheetStore } from "@/store/sheet";
import toast from "react-hot-toast";
import { deleteConversation, updateConversation } from "@/actions/conversation";
import { useModalStore } from "@/store/modal";
import { ModalFooter } from "../modal/ModalFooter";
import { BASE_URL } from "@/constants/routes";

type Props = {
    item: {
        id: string;
        href: string;
        icon: ReactNode;
        label: string;
    };
};

export function SidebarItem({ item }: Props) {
    const { id, href, icon, label } = item;
    const pathname = usePathname();
    const params = useParams<{ conversationId: string }>();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [value, setValue] = useState(item.label);
    const { openModal, closeModal } = useModalStore((state) => ({
        openModal: state.openModal,
        closeModal: state.closeModal,
    }));
    const setOpen = useSheetStore((state) => state.setOpen);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            await handleBlur();
        }
    };

    const handleBlur = async () => {
        setIsEditMode(false);
        if (value !== label) {
            try {
                await updateConversation(id, value);
            } catch (error) {
                console.error(error);
                toast.error("Failed to update name.");
            }
        }
    };

    const handleDelete = async () => {
        try {
            await deleteConversation(id);

            toast.success("Successfully deleted.");

            if (params.conversationId === id) {
                router.push(BASE_URL);
            }

            closeModal();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete.");
        }
    };

    const clickDelete = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        // Modal Logic
        openModal({
            title: "Are you sure you want to delete?",
            description: "Once deleted, the data may be unrecoverable.",
            footer: <ModalFooter onCancel={closeModal} onConfirm={handleDelete} />,
        });
    };

    const clickEdit = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setIsEditMode(true);
        setIsMenuOpen(false);
    };

    useEffect(() => {
        if (isEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditMode]);

    return (
        <Link
            href={href}
            scroll={false}
            className={cn(
                "flex items-center justify-between text-sm p-3 group hover:text-white hover:bg-white/10 rounded-lg",

                isMenuOpen || pathname === href ? "text-white bg-white/10" : "text-zinc-400"
            )}
            onClick={() => setOpen(false)}
        >
            {/* label area */}
            <div className="flex items-center gap-2">
                {icon}{" "}
                {isEditMode ? (
                    <input
                        value={value}
                        onChange={handleChange}
                        onClick={(event) => event.preventDefault()}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent border border-zinc-400 rounded-lg px-2 py-1"
                        ref={inputRef}
                    />
                ) : (
                    <div className="w-[180px] truncate">{label}</div>
                )}
            </div>
            {/* Dropdown menu area */}
            {id !== "new" && (
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <div onClick={handleMenu}>
                            <Ellipsis
                                className={cn(
                                    "group-hover:block text-gray-400 hover:text-white",
                                    isMenuOpen ? "block text-white" : "md:hidden text-gray-400"
                                )}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="gap-2" onClick={clickEdit}>
                            <Pencil size={18} />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={clickDelete}>
                            <Trash size={18} />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </Link>
    );
}
