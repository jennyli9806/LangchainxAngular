import { Component , OnInit } from '@angular/core';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { HumanMessage, ChatMessage, SystemMessage, ChainValues } from "langchain/schema";
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(){}
  title = '';
  input = '';
  text ='';
  agentText!: ChainValues;
  chatInput!: string;
  chatInput2!: string;
  chatOutput!: string;
  openAIKey = environment.openAIApiKey
  serpAPIKey = environment.SERPAPIKEY
  
  async simpleChain() {
    try {
      const llm = new OpenAI({
        openAIApiKey: this.openAIKey,
        temperature: 0.9,
      });
      const prompt = PromptTemplate.fromTemplate("What is a good name for a company that makes {product}?");

      const chain = new LLMChain({
       llm,
       prompt
        });
      // Run is a convenience method for chains with prompts that require one input and one output.
     const result = await chain.run("simple pants");
     this.input = result;
    }
    catch (error) {
      console.error("An error occurred:", error);
    }
  }
  async predictCompany() {
    try {
      const llm = new OpenAI({
        openAIApiKey: this.openAIKey,
        temperature: 0.9,
      }); // Instantiate your LLM Library class
      const result = await llm.predict("What would be a good destination to visit in Europe for a beach holiday?");
      this.title = result;
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  //translating using chatmodel
  async translate() {
    try {
      const chat = new ChatOpenAI({
        openAIApiKey: this.openAIKey,
        temperature: 0
      });
      
      const result = await chat.predictMessages([
        new HumanMessage("Translate this sentence from English to French. I love programming.")
      ]);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async agent() {
    try {
      const model = new OpenAI({ openAIApiKey: this.openAIKey, temperature: 0 });
const tools = [
  new SerpAPI(this.serpAPIKey, {
    location: "Austin,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];
//using the most general agent model
const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
});

const input = "What was the high temperature in Toronto yesterday in Celcius? What is that number raised to the power of 3?";

const result = await executor.call({
  input,
});
this.agentText = result['output'];
    }
    catch (error) {
      console.error("An error occurred:", error);
    }
  }

  async memoryModel() {
    try{
      const model = new OpenAI({
        openAIApiKey: this.openAIKey,
        temperature: 0.9,
      });
      const memory = new BufferMemory();
      const chain = new ConversationChain({
        llm: model,
        memory,
        verbose: true,
        });
        this.chatInput = "Hi! I'm Jenny.";
        this.chatInput2 = "What's my name?";
    const res1 = await chain.call({ input: this.chatInput });
    const res2 = await chain.call({ input: this.chatInput2 });
    console.log(res2)
    this.chatOutput = res2['response'];
    
    }
    catch (error) {
      console.error("An error occurred:", error);
    }
  }
  ngOnInit(): void {
    this.predictCompany();
    // this.translate();
    this.simpleChain();
    this.agent();
    this.memoryModel();
  }
  
}
