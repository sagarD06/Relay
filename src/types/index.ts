import { Prisma } from "@prisma/client";
import type { Message } from "@prisma/client";

export type User = {
	id: string;
	email: string;
	name: string;
	image: string;
	createdAt: Date;
	updatedAt: Date;
};
interface ModelPricing {
	prompt: string;
	completion: string;
	request?: string;
}
export type Model = {
	id: string;
	name: string;
	description: string;
	context_length: number;
	architecture: {
		modality: string;
		input_modalities: ["image", "text", "video"];
		output_modalities: ["text"];
		tokenizer: string;
		instruct_type: string;
	};
	pricing: ModelPricing;
	top_provider: {
		provider: string;
		price_per_million_tokens: number;
		max_completion_tokens: number;
		is_moderated: boolean;
	};
};

export type ChatwithMessages = Prisma.ChatGetPayload<{ include: { messages: true } }>;
export type Messages = Message