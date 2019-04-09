# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_03_25_131919) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "likes", force: :cascade do |t|
    t.integer "project_id"
    t.integer "admirer_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "notes", force: :cascade do |t|
    t.string "name"
    t.float "freq"
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.integer "author_id"
    t.string "image"
    t.string "description"
    t.integer "width"
    t.integer "height"
    t.integer "amount_of_notes"
    t.integer "tempo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "rectangles", force: :cascade do |t|
    t.integer "posX"
    t.integer "posY"
    t.integer "width"
    t.integer "height"
    t.integer "project_id"
    t.integer "note_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "profile"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
