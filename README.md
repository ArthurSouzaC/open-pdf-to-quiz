# Open PDF to Quiz

Open source tool that takes content from a PDF file and generate custom quizzes using AI through ollama.

## Installation steps

In order to get Open PDF to Quiz running in your machine, you need to install [ollama](https://ollama.com/). Follow the steps from their own website.

After that, you need to pull the _mistral-small_ model from ollama. You can do it from the terminal with the following command.

```bash
ollama run mistral-small
```

Now you have all things set-up for running Open PDF to Quiz. You can install it from our [releases](https://github.com/ArthurSouzaC/open-pdf-to-quiz/releases).

## Running locally from source code

If you prefer to run it locally from the source code, you just need to clone, install the deps and start the project.

Make sure to have a stable Node.js version installed on your machine.

```bash
git clone https://github.com/ArthurSouzaC/open-pdf-to-quiz.git

cd open-pdf-to-quiz

yarn install

yarn dev:electron

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)