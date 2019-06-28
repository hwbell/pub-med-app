import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import ArticleResult from './ArticleResult';
import { jsxEmptyExpression } from '@babel/types';

// some sample props
const article = { id: '30724720',
source: 'MED',
pmid: '30724720',
pmcid: 'PMC6366410',
doi: '10.1080/22423982.2019.1571383',
title:
 'Agreement between self-reported and central cancer registry-recorded prevalence of cancer in the Alaska EARTH study.',
authorString: 'Nash SH, Day G, Hiratsuka VY, Zimpelman GL, Koller KR.',
authorList:
 { author: [ [Object], [Object], [Object], [Object], [Object] ] },
authorIdList: { authorId: [ [Object], [Object] ] },
journalInfo:
 { issue: '1',
   volume: '78',
   journalIssueId: 2773052,
   dateOfPublication: '2019 Dec',
   monthOfPublication: 12,
   yearOfPublication: 2019,
   printPublicationDate: '2019-12-01',
   journal:
    { title: 'International journal of circumpolar health',
      medlineAbbreviation: 'Int J Circumpolar Health',
      essn: '2242-3982',
      issn: '1239-9736',
      nlmid: '9713056',
      isoabbreviation: 'Int J Circumpolar Health' } },
pubYear: '2019',
pageInfo: '1571383',
abstractText: 'Reliance on self-reported health status information as a measure of population health can be challenging due to errors associated with participant recall. We sought to determine agreement between self-reported and registry-recorded site-specific cancer diagnoses in a cohort of Alaska Native people. We linked cancer history information from the Alaska Education and Research Towards Health (EARTH) cohort and the Alaska Native Tumor Registry (ANTR), and calculated validity measures (sensitivity, specificity, positive predictive value, negative predictive value, kappa). Multiple logistic regression models were used to assess independent associations of demographic variables with incorrect reporting. We found that among Alaska EARTH participants, 140 self-reported a history of cancer, and 99 matched the ANTR. Sensitivity ranged from 79% (colorectal cancer) to 100% (prostate cancer); specificity was over 98% for all-sites examined. Kappa was higher among prostate and female breast cancers (κ=0.86) than colorectal cancers (κ=0.63). Women (odds ratio [OR] (95% confidence interval [CI]): 2.8 (1.49-5.31)) and participants who were older than 50 years (OR (95% CI): 2.8 (1.53-4.12)) were more likely to report incorrectly. These data showed good agreement between self-reported and registry-recorded cancer history. This may be attributed to the high quality of care within the Alaska Tribal Health System, which strongly values patient-provider relationships and the provision of culturally appropriate care.',
affiliation: 'a Alaska Native Tumor Registry, Alaska Native Epidemiology Center, Community Health Services , Alaska Native Tribal Health Consortium , Anchorage , AK , USA.',
language: 'eng',
pubModel: 'Print',
pubTypeList: { pubType: [ 'research-article', 'Journal Article' ] },
keywordList:{ 
  keyword: [ 'Validity',
      'Cohort study',
      'Health Literacy',
      'Self-report',
      'Native American',
      'Alaska Native Cancer',
      'Tumour Registry' ] },
fullTextUrlList: { fullTextUrl: [ [Object], [Object], [Object] ] },
isOpenAccess: 'Y',
inEPMC: 'Y',
inPMC: 'N',
hasPDF: 'Y',
hasBook: 'N',
hasSuppl: 'Y',
citedByCount: 0,
hasReferences: 'Y',
hasTextMinedTerms: 'Y',
hasDbCrossReferences: 'N',
hasLabsLinks: 'Y',
license: 'cc by-nc',
authMan: 'N',
epmcAuthMan: 'N',
nihAuthMan: 'N',
hasTMAccessionNumbers: 'N',
dateOfCreation: '2019-02-07',
firstIndexDate: '2019-02-08',
dateOfRevision: '2019-02-19',
firstPublicationDate: '2019-12-01' }

const dummyFunction = jest.fn();
const dummyFunction2 = jest.fn();

const searchButtons = [
  {
    text: 'view article',
    onClick: dummyFunction
  },
  {
    text: 'add to collection',
    onClick: dummyFunction2
  }
];

const wrapper = shallow(<ArticleResult article={article} buttons={searchButtons} />);

it('renders without crashing', async () => {
  let deepwrapper = mount(<ArticleResult article={article} buttons={searchButtons} />);
});

it('renders correctly', async () => {
  const tree = await renderer
    .create(<ArticleResult article={article} buttons={searchButtons} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('contains the correct elements', () => {
  // contains one article result
  // expect(wrapper.find('.article-result').length > 0).toBe(true);
  expect(wrapper.find('.article-result').length).toBe(1);

  // contains three .article-title elements - the title, authors, and journal 
  expect(wrapper.find('.article-title').length).toBe(3);  
  expect(wrapper.find('.article-title').at(0).text()).toEqual(article.title)
  expect(wrapper.find('.article-title').at(1).text()).toEqual(article.authorString)
  expect(wrapper.find('.article-title').at(2).text()).toContain(article.journalInfo.journal.title)

  // contains 2 correct buttons
  expect(wrapper.find('.article-button').length).toBe(2);
  expect(wrapper.find('.article-button').at(0).html()).toContain(searchButtons[0].text)
  expect(wrapper.find('.article-button').at(1).html()).toContain(searchButtons[1].text)
})

it('receives and fires the right functions as props', () => {
  wrapper.find('.article-button').at(0).simulate('click');
  expect(dummyFunction.mock.calls.length).toEqual(1);

  wrapper.find('.article-button').at(1).simulate('click');
  expect(dummyFunction2.mock.calls.length).toEqual(1);
})