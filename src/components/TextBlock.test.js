import React from 'react';
import ReactDOM from 'react-dom';
import TextBlock from './TextBlock';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';

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

it('renders without crashing', async () => {
  let wrapper = mount(<TextBlock text={aboutIntro}/>);
});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<TextBlock text={aboutIntro}/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the correct elements for different data', () => {
  let wrapper = mount( <TextBlock text={aboutIntro}/>);
  
  expect(wrapper.html()).toContain('div class=\"glass\"');
  expect(wrapper.html()).toContain('h4 class=\"subtitle\"');
  
  expect(wrapper.find('.subtitle').length).toEqual(1);
  expect(wrapper.find('Button').length).toEqual(1);
  expect(wrapper.find('.text').length).toEqual(1);

  wrapper = mount( <TextBlock text={resourcesIntro}/>);
  
  expect(wrapper.html()).toContain('div class=\"glass\"');
  expect(wrapper.html()).toContain('h4 class=\"subtitle\"');
  
  expect(wrapper.find('.subtitle').length).toEqual(1);
  expect(wrapper.find('Button').length).toEqual(1);
  expect(wrapper.find('.text').length).toEqual(6);

})