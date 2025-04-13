# Novylist AI Integration Prototypes

This directory contains prototype implementations and testing scripts for AI integration research in the Novylist project.

## Contents

- `openai-model-evaluation.js` - Script for evaluating different OpenAI models for novel writing assistance
- `prompts/` - Sample prompts used in the evaluation
- `.env.example` - Example environment variables configuration
- `package.json` - Node.js package configuration

## OpenAI Model Evaluation

The model evaluation script tests different OpenAI models (GPT-4, GPT-3.5-turbo, etc.) against a set of novel writing assistance tasks to compare:

- Response quality
- Latency
- Token usage
- Cost

### Setup

1. Install Node.js dependencies:

```bash
npm install
```

2. Create a `.env` file in this directory with your OpenAI API key:

```bash
cp .env.example .env
```

3. Edit the `.env` file with your actual OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Tests

To run the model evaluation:

```bash
npm run test:models
```

This will:
1. Test all configured models against the sample prompts
2. Generate responses from each model
3. Measure latency, token usage, and estimated cost
4. Save the results to the `./results` directory
5. Generate a summary of the findings

### Customizing Tests

#### Test Prompts

Test prompts are stored in the `prompts/` directory as JSON files. Each file defines a prompt with variables like:

- `genre` - The genre of the novel
- `recentText` - Sample text to continue
- `characterInfo` - Information about the characters
- ...and more

You can add new prompts by creating additional JSON files following the same structure.

#### Configuration

The script can be configured through environment variables in the `.env` file:

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `MODELS` - Comma-separated list of models to test
- `TEMPERATURE` - Temperature parameter for generation (default: 0.7)
- `MAX_TOKENS` - Maximum tokens to generate (default: 1000)
- `REPETITIONS_PER_PROMPT` - Number of times to run each prompt (default: 3)
- `OUTPUT_DIRECTORY` - Where to save results (default: ./results)

### Understanding Results

The script generates two files:

1. `model-evaluation-[timestamp].json` - Raw results from all tests
2. `summary-[timestamp].json` - Summary statistics comparing models

The summary includes:

- Average latency
- Average token usage
- Average cost per request
- Success rate

## Adding More Prototypes

To add a new prototype:

1. Create a new directory or file for your prototype
2. Update this README with information about the prototype
3. Add any new dependencies to `package.json`

## Next Steps

After evaluating the models, we'll use the findings to:

1. Select the optimal model(s) for different assistance types
2. Develop prompt optimization strategies
3. Create context handling techniques for long-form content
4. Design caching mechanisms for performance optimization
