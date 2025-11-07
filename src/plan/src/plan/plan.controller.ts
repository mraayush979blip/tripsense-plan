@Get('ai')
async getAIStory(@Query('query') query: string) {
  return this.planService.getAIStory(query);
}
