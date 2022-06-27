# frozen_string_literal: true
require_relative '../../plugin_helper'

describe Multilingual::AdminTranslationsController do
  fab!(:admin_user) { Fabricate(:user, admin: true) }
  fab!(:tag1) { Fabricate(:tag, name: "pavilion") }
  fab!(:tag2) { Fabricate(:tag, name: "follow") }
  let(:custom_languages) { "#{Rails.root}/plugins/discourse-multilingual/spec/fixtures/custom_languages.yml" }
  let(:category_translation) { "#{Rails.root}/plugins/discourse-multilingual/spec/fixtures/category_name.wbp.yml" }
  let(:server_locale) { "#{Rails.root}/plugins/discourse-multilingual/spec/fixtures/server.wbp.yml" }
  let(:tag_translation) { "#{Rails.root}/plugins/discourse-multilingual/spec/fixtures/tag.wbp.yml" }

  before(:all) do
    sign_in(admin_user)
    SiteSetting.multilingual_enabled = true
    SiteSetting.multilingual_content_languages_enabled = true
    Multilingual::CustomLanguage.create("wbp", name: "Warlpiri", run_hooks: true)
    Multilingual::Language.setup
    Multilingual::ContentTag.update_all
  end

  before(:each) do
    Multilingual::Cache.refresh!
  end

  it "uploads category translation" do
    post '/admin/multilingual/translations.json', params: {
      file: Rack::Test::UploadedFile.new(category_translation)
    }
    expect(response.status).to eq(200)
    expect(Multilingual::TranslationFile.by_type(["category_name"]).count).to eq(1)
    expect(Multilingual::Translation.get("category_name", ["welcome"])).to eq({ "wbp" => "pardu-pardu-mani" })
  end

  it "uploads tag translation" do
    post '/admin/multilingual/translations.json', params: {
      file: Rack::Test::UploadedFile.new(tag_translation)
    }
    expect(response.status).to eq(200)
    expect(Multilingual::TranslationFile.by_type(["tag"]).count).to eq(1)
    expect(Multilingual::Translation.get("tag", "wbp")).to eq({ "pavilion" => "parnka", "follow" => "ngurra" })
  end
end
