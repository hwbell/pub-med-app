import React from 'react';
import ReactDOM from 'react-dom';
import TextBlock from './TextBlock';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

// react router context
import { MemoryRouter } from 'react-router-dom';

// stub for the navigateToResource function
const navigateToResourceStub = jest.fn();

// some mock data. test with data that has different lengths for the paragraph array
const aboutIntro = {
  title: 'About PMC',
  paragraph: [
    `PubMed Central (PMC) is a free digital repository that archives 
  publicly accessible full-text scholarly articles that have been published within the 
  biomedical and life sciences journal literature. As one of the major research 
  databases within the suite of resources that have been developed by the National 
  Center for Biotechnology Information (NCBI), PubMed Central is much more than just 
  a document repository. Launched in February 2000, the repository has grown rapidly 
  as the NIH Public Access Policy is designed to make all research funded by the 
  National Institutes of Health (NIH) freely accessible to anyone, and, in addition, 
  many publishers are working cooperatively with the NIH to provide free access to 
  their works.`,
  ],
  button: 'read more'
}

const resourcesIntro = {
  title: 'Resources',
  paragraph: [
    'abstracts > 34 million',
    'full text articles > 5 million',
    'patents > 4 million',
    'preprints > 74,000',
    'agricola records > 700,000',
    'NIH clinical guidelines > 800'
  ],
  button: 'find a resource'
}


describe('TextBlock', () => {

  let wrapper;
  let someProps;
  beforeEach(() => {
    someProps = {
      buttons: [
        {
          text: 'start mining',
          link: '/search'
        },
        {
          text: 'make a profile',
          link: '/profile'
        },
        {
          text: 'learn more first',
          link: '/about'
        },

      ],
      navigateToResource: navigateToResourceStub,
      text: resourcesIntro
    }

    wrapper = mount(
      <MemoryRouter>
        <TextBlock {...someProps} />
      </MemoryRouter>
    );

  })

  // tests
  it('renders without crashing', async () => {
    wrapper.update();
  });

  it('renders correctly', async () => {
    const tree = await renderer
      .create(
        <MemoryRouter>
          <TextBlock {...someProps} />
        </MemoryRouter>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct elements for different data', () => {

    expect(wrapper.find('.glass').length).toEqual(1);
    expect(wrapper.find('.thread-title').length).toEqual(1);
    expect(wrapper.find('Button').length).toEqual(3);
    expect(wrapper.find('Link').length).toEqual(3);
    expect(wrapper.find('.thread-text').length).toEqual(6);

    // change props
    someProps.text = aboutIntro;
    let newWrapper = mount(
      <MemoryRouter>
        <TextBlock {...someProps} />
      </MemoryRouter>
    );

    expect(newWrapper.find('.glass').length).toEqual(1);
    expect(newWrapper.find('.thread-title').length).toEqual(1);
    expect(newWrapper.find('Button').length).toEqual(3);
    expect(newWrapper.find('Link').length).toEqual(3);
    expect(newWrapper.find('.thread-text').length).toEqual(1);

  })

  it('should render all buttons with info from provided props.buttons', () => {
    expect(wrapper.find('Link').at(0).props().to).toBe(someProps.buttons[0].link)
    expect(wrapper.find('Link').at(1).props().to).toBe(someProps.buttons[1].link)
    expect(wrapper.find('Link').at(2).props().to).toBe(someProps.buttons[2].link)

  })
})