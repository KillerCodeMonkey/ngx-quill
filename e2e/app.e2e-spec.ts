import { Ng2quillPage } from './app.po';

describe('ng2quill App', function() {
  let page: Ng2quillPage;

  beforeEach(() => {
    page = new Ng2quillPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
