export interface MessageDto {
    id: string;
    sender_username: string;
    title: string;
    desc: string;
    receivers: string[];
    referenced_event_id: string | null;
    creation_date: string;
    last_edited_date: string;
    visible: boolean;
}
