import {v4 as generateUUID} from 'uuid';
import {generateUser, translate as t,} from '../../../../helpers/api-integration/v3';

xdescribe('GET /export/avatar-:memberId.html', () => {
  let user;

  before(async () => {
    user = await generateUser();
  });

  it('validates req.params.memberId', async () => {
    await expect(user.get('/export/avatar-:memberId.html')).to.eventually.be.rejected.and.eql({
      code: 400,
      error: 'BadRequest',
      message: t('invalidReqParams'),
    });
  });

  it('handles non-existing members', async () => {
    const dummyId = generateUUID();
    await expect(user.get(`/export/avatar-${dummyId}.html`)).to.eventually.be.rejected.and.eql({
      code: 404,
      error: 'NotFound',
      message: t('userWithIDNotFound', { userId: dummyId }),
    });
  });

  it('returns an html page', async () => {
    const res = await user.get(`/export/avatar-${user._id}.html`);
    expect(res.substring(0, 100).indexOf('<!DOCTYPE html>')).to.equal(0);
  });
});
