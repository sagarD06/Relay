import { NextResponse } from "next/server";

export async function GET() {
	try {
		const response = await fetch("https://openrouter.ai/api/v1/models", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error(`Open router API error ${response.status}`);
		}

		const data = await response.json();

		const freeModels = data.data.filter(
			(model: { pricing: { prompt: string; completion: string } }) => {
				const promptPrice = parseFloat(model.pricing?.prompt || "0");
				const completionPrice = parseFloat(model.pricing?.completion || "0");

				return promptPrice === 0 && completionPrice === 0;
			}
		);

        interface ModelPricing {
            prompt: string;
            completion: string;
        }

        interface Model {
            id: string;
            name: string;
            description: string;
            context_length: number;
            architecture: {
                modality: string;
                tokenizer: string;
                instruct_type: string;
            };
            pricing: ModelPricing;
            top_provider: {
                provider: string;
                price_per_million_tokens: number;
            };
        }

        interface FormattedModel {
            id: string;
            name: string;
            description: string;
            context_length: number;
            architecture: Model['architecture'];
            pricing: ModelPricing;
            top_provider: Model['top_provider'];
        }

        const formattedModels: FormattedModel[] = freeModels.map((model: Model) => ({
            id: model.id,
            name: model.name,
            description: model.description,
            context_length: model.context_length,
            architecture: model.architecture,
            pricing: model.pricing,
            top_provider: model.top_provider,
        }));

		return NextResponse.json({
			success: true,
			models: formattedModels,
			message: "Models fetched successfully",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong while fetching the AI models",
			},
			{ status: 500 }
		);
	}
}
